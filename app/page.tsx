"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Plus, Home, ArrowRight, Check, X } from "lucide-react"
import { motion } from "framer-motion"

type Person = {
  id: string
  name: string
}

type Expense = {
  id: string
  title: string
  amount: number
  paidBy: string
  splitBetween: string[]
  date: Date
  category: string
}

type Group = {
  id: string
  name: string
  members: Person[]
  expenses: Expense[]
}

export default function ExpenseTracker() {
  const [groups, setGroups] = useState<Group[]>([])
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null)
  const [newGroupName, setNewGroupName] = useState("")
  const [newMemberName, setNewMemberName] = useState("")
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: 0,
    paidBy: "",
    category: "food",
  })
  const [view, setView] = useState<"home" | "createGroup" | "groupDetails" | "addExpense">("home")
  const [showMemberAdded, setShowMemberAdded] = useState(false)
  const [showGroupCreated, setShowGroupCreated] = useState(false)

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedGroups = localStorage.getItem("expenseTrackerGroups")
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups))
    }
  }, [])

  // Save data to localStorage whenever groups change
  useEffect(() => {
    localStorage.setItem("expenseTrackerGroups", JSON.stringify(groups))
  }, [groups])

  const createGroup = () => {
    const newGroup: Group = {
      id: Date.now().toString(),
      name: newGroupName,
      members: currentGroup?.members || [],
      expenses: [],
    }
    setGroups([...groups, newGroup])
    setNewGroupName("")
    setCurrentGroup(newGroup)
    setShowGroupCreated(true)
    setTimeout(() => {
      setShowGroupCreated(false)
      setView("groupDetails")
    }, 2000)
  }

  const addMemberToGroup = () => {
    if (!newMemberName) return

    const updatedGroup = {
      id: currentGroup?.id || "temp",
      name: currentGroup?.name || "",
      members: [...(currentGroup?.members || []), { id: Date.now().toString(), name: newMemberName }],
      expenses: currentGroup?.expenses || [],
    }

    setCurrentGroup(updatedGroup)
    setNewMemberName("")
    setShowMemberAdded(true)
    setTimeout(() => setShowMemberAdded(false), 2000)
  }

  const removeMember = (memberId: string) => {
    if (!currentGroup) return

    const updatedGroup = {
      ...currentGroup,
      members: currentGroup.members.filter((m) => m.id !== memberId),
    }

    setCurrentGroup(updatedGroup)
  }

  const addExpenseToGroup = () => {
    if (!currentGroup || !newExpense.title || !newExpense.amount || !newExpense.paidBy) return

    const updatedGroup = {
      ...currentGroup,
      expenses: [
        ...currentGroup.expenses,
        {
          id: Date.now().toString(),
          title: newExpense.title,
          amount: newExpense.amount,
          paidBy: newExpense.paidBy,
          splitBetween: currentGroup.members.map((m) => m.id),
          date: new Date(),
          category: newExpense.category,
        },
      ],
    }

    setGroups(groups.map((g) => (g.id === currentGroup.id ? updatedGroup : g)))
    setCurrentGroup(updatedGroup)
    setNewExpense({
      title: "",
      amount: 0,
      paidBy: "",
      category: "food",
    })
    setView("groupDetails")
  }

  const calculateBalances = (group: Group) => {
    const balances: Record<string, number> = {}

    group.members.forEach((member) => {
      balances[member.id] = 0
    })

    group.expenses.forEach((expense) => {
      const splitAmount = expense.amount / expense.splitBetween.length

      // Person who paid gets credited the full amount
      balances[expense.paidBy] += expense.amount

      // Each person who owes gets debited their share
      expense.splitBetween.forEach((personId) => {
        balances[personId] -= splitAmount
      })
    })

    return balances
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      {/* Success Notifications */}
      {showMemberAdded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <Check className="w-5 h-5" />
            Member added successfully!
          </div>
        </motion.div>
      )}

      {showGroupCreated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <Check className="w-5 h-5" />
            Group created successfully!
          </div>
        </motion.div>
      )}

      {view === "home" && (
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-3 text-indigo-700">
              <Home className="w-6 h-6" /> Expense Tracker
            </h1>
            <Button
              onClick={() => {
                setCurrentGroup(null)
                setNewGroupName("")
                setView("createGroup")
              }}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" /> New Group
            </Button>
          </div>

          {groups.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-8 text-center"
            >
              <Users className="w-12 h-12 mx-auto text-indigo-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">No groups yet</h2>
              <p className="text-gray-500 mb-6">Create your first group to start tracking expenses</p>
              <Button onClick={() => setView("createGroup")} className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" /> Create Group
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {groups.map((group) => {
                const balances = calculateBalances(group)
                const userBalance = balances[group.members[0]?.id] || 0

                return (
                  <motion.div key={group.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Card
                      className="hover:shadow-md transition-shadow cursor-pointer border-0 shadow-sm"
                      onClick={() => {
                        setCurrentGroup(group)
                        setView("groupDetails")
                      }}
                    >
                      <CardHeader>
                        <CardTitle className="text-xl text-indigo-700">{group.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {group.members.length} members • {group.expenses.length} expenses
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div
                          className={`text-lg font-semibold ${
                            userBalance > 0 ? "text-green-600" : userBalance < 0 ? "text-red-600" : "text-gray-600"
                          }`}
                        >
                          {userBalance > 0
                            ? `You are owed $${userBalance.toFixed(2)}`
                            : userBalance < 0
                              ? `You owe $${Math.abs(userBalance).toFixed(2)}`
                              : "All settled up"}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {view === "createGroup" && (
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setView("home")}
              className="text-indigo-600 hover:bg-indigo-50"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
            </Button>
            <h1 className="text-2xl font-bold text-indigo-700">Create New Group</h1>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="groupName" className="text-gray-700">
                    Group Name
                  </Label>
                  <Input
                    id="groupName"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="e.g. Roommates, Trip to NYC"
                    className="border-gray-300 focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-700">Add Members</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      placeholder="Enter member name"
                      className="border-gray-300 focus:border-indigo-500"
                    />
                    <Button
                      onClick={addMemberToGroup}
                      className="bg-indigo-600 hover:bg-indigo-700"
                      disabled={!newMemberName}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {currentGroup?.members.length ? (
                    <div className="mt-4 space-y-2">
                      <Label className="text-gray-700">Group Members</Label>
                      <div className="space-y-2">
                        {currentGroup.members.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg"
                          >
                            <span className="font-medium">{member.name}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-6 h-6 text-red-500 hover:bg-red-50"
                              onClick={() => removeMember(member.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-gray-500">No members added yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={createGroup}
                  disabled={!newGroupName || !currentGroup?.members.length}
                >
                  Create Group
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      )}

      {view === "groupDetails" && currentGroup && (
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setView("home")}
              className="text-indigo-600 hover:bg-indigo-50"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
            </Button>
            <h1 className="text-2xl font-bold text-indigo-700">{currentGroup.name}</h1>
          </div>

          <div className="mb-6">
            <Card className="border-0 shadow-sm bg-gradient-to-r from-indigo-50 to-blue-50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-700">Group Balance</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {currentGroup.members.length} members
                    </p>
                  </div>
                  <div className="text-xl font-semibold">
                    {(() => {
                      const balances = calculateBalances(currentGroup)
                      const userBalance = balances[currentGroup.members[0]?.id] || 0
                      return (
                        <span
                          className={
                            userBalance > 0 ? "text-green-600" : userBalance < 0 ? "text-red-600" : "text-gray-600"
                          }
                        >
                          {userBalance > 0
                            ? `You are owed $${userBalance.toFixed(2)}`
                            : userBalance < 0
                              ? `You owe $${Math.abs(userBalance).toFixed(2)}`
                              : "All settled up"}
                        </span>
                      )
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Expenses</h2>
            <Button onClick={() => setView("addExpense")} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" /> Add Expense
            </Button>
          </div>

          {currentGroup.expenses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-8 text-center border-0"
            >
              <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">No expenses yet</h2>
              <p className="text-gray-500 mb-6">Add your first expense to this group</p>
              <Button onClick={() => setView("addExpense")} className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" /> Add Expense
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {currentGroup.expenses.map((expense) => {
                const paidBy = currentGroup.members.find((m) => m.id === expense.paidBy)?.name || "Unknown"

                return (
                  <motion.div key={expense.id} whileHover={{ scale: 1.01 }}>
                    <Card className="border-0 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg">{expense.title}</CardTitle>
                        <CardDescription className="flex flex-wrap gap-x-4 gap-y-1">
                          <span>{new Date(expense.date).toLocaleDateString()}</span>
                          <span className="capitalize">{expense.category}</span>
                          <span>Paid by {paidBy}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-semibold text-indigo-700">${expense.amount.toFixed(2)}</span>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            Split between {expense.splitBetween.length} people
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {view === "addExpense" && currentGroup && (
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setView("groupDetails")}
              className="text-indigo-600 hover:bg-indigo-50"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
            </Button>
            <h1 className="text-2xl font-bold text-indigo-700">Add Expense</h1>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="expenseTitle" className="text-gray-700">
                    Title
                  </Label>
                  <Input
                    id="expenseTitle"
                    value={newExpense.title}
                    onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                    placeholder="e.g. Dinner, Groceries"
                    className="border-gray-300 focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="expenseAmount" className="text-gray-700">
                    Amount
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="expenseAmount"
                      type="number"
                      value={newExpense.amount || ""}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: Number.parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      className="border-gray-300 focus:border-indigo-500 pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="expenseCategory" className="text-gray-700">
                    Category
                  </Label>
                  <Select
                    value={newExpense.category}
                    onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-indigo-500">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food & Dining</SelectItem>
                      <SelectItem value="transport">Transportation</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="paidBy" className="text-gray-700">
                    Paid by
                  </Label>
                  <Select
                    value={newExpense.paidBy}
                    onValueChange={(value) => setNewExpense({ ...newExpense, paidBy: value })}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-indigo-500">
                      <SelectValue placeholder="Select who paid" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentGroup.members.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 pt-2">
                  <Label className="text-gray-700">Split between</Label>
                  <div className="space-y-2">
                    {currentGroup.members.map((member) => (
                      <div key={member.id} className="flex items-center space-x-3">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 border-2 border-indigo-300 flex items-center justify-center">
                          <Check className="w-3 h-3 text-indigo-600" />
                        </div>
                        <Label htmlFor={`member-${member.id}`} className="font-normal">
                          {member.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    Currently splitting equally between all {currentGroup.members.length} members
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={addExpenseToGroup}
                  disabled={!newExpense.title || !newExpense.amount || !newExpense.paidBy}
                >
                  Add Expense
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  )
}
